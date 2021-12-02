import type { ActionFunction, LoaderFunction } from 'remix';
import { useActionData, redirect, Form } from 'remix';
import { Button, TextField } from '@mui/material';
import { requireUserId } from '~/utils/session.server';
import { createDashboard, getUserDashboard } from '~/utils/dashboards.server';

type ActionData = {
  formError?: string;
};

export const loader: LoaderFunction = ({ request }) => requireUserId(request);

export const action: ActionFunction = async ({
  request,
}): Promise<Response | ActionData> => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get('name');

  if (typeof name !== 'string') {
    return { formError: 'Form not submitted correctly.' };
  }

  if (!name) return { formError: 'Name must not be empty' };

  const existingDashboard = await getUserDashboard(userId, name);
  if (existingDashboard) {
    return { formError: `Dashboard ${name} already exists` };
  }

  const dashboard = await createDashboard(userId, name);
  return redirect(`/dashboards/${dashboard.id}`);
};

export default function NewDashboardRoute() {
  const actionData = useActionData<ActionData | undefined>();

  return (
    <Form
      method="post"
      aria-describedby={
        actionData?.formError
          ? 'form-error-message'
          : undefined
      }
    >
      <TextField
        id="dashboard-name"
        name="name"
        label="Dashboard Name"
        aria-invalid={Boolean(
          actionData?.formError,
        )}
        aria-describedby={
           actionData?.formError
             ? 'name-error'
             : undefined
          }
      />
      <div id="form-error-message">
        {actionData?.formError ? (
          <p
            className="form-validation-error"
            role="alert"
          >
            {actionData?.formError}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="button">
        Submit
      </Button>
    </Form>
  );
}
