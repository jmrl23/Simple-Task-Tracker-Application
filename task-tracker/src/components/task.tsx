import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderIcon, PenIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

interface TaskProps {
  data: Task;
  refresh: () => void;
  sessionId?: string;
}

export function Task(props: TaskProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  async function toggleStatus(checked: boolean) {
    await fetch(`/tasks/${props.data.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${props.sessionId}`,
      },
      body: JSON.stringify({
        status: checked ? 'completed' : 'pending',
      }),
    });
    props.refresh();
  }

  return (
    <div className='flex justify-between gap-4 items-center p-4'>
      <div className='flex gap-4 items-center'>
        <Checkbox
          checked={props.data.status === 'completed'}
          onCheckedChange={toggleStatus}
        />
        <span
          className={cn(props.data.status === 'completed' && 'line-through')}
        >
          {props.data.content}
        </span>
      </div>
      <div className='flex gap-4 items-center'>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button type='button' variant={'outline'} title='edit'>
              <PenIcon className='w-6 h-6' />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit task</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <EditTaskForm
              {...props}
              closeDialog={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button type='button' variant={'destructive'} title='delete'>
              <TrashIcon className='w-6 h-6' />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this task?
              </DialogDescription>
            </DialogHeader>
            <DeleteTaskForm
              sessionId={props.sessionId}
              taskId={props.data.id}
              closeDialog={() => setIsDeleteDialogOpen(false)}
              refresh={props.refresh}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

interface EditTaskFormProps extends TaskProps {
  closeDialog(): void;
}

const editFormSchema = z.object({
  content: z.string(),
});

function EditTaskForm(props: EditTaskFormProps) {
  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      content: props.data.content,
    },
  });

  async function onSubmit(values: z.infer<typeof editFormSchema>) {
    await fetch(`/tasks/${props.data.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${props.sessionId}`,
      },
      body: JSON.stringify(values),
    });
    props.refresh();
    props.closeDialog();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Edit task' {...field} autoComplete='off' />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='flex mt-4 justify-end items-center'>
          <Button>Submit</Button>
        </div>
      </form>
    </Form>
  );
}

interface DeleteTaskFormProps {
  sessionId?: string;
  taskId: string;
  closeDialog(): void;
  refresh(): void;
}

function DeleteTaskForm(props: DeleteTaskFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function deleteTask() {
    setIsLoading(true);
    await fetch(`/tasks/${props.taskId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${props.sessionId}`,
      },
    });
    props.refresh();
    props.closeDialog();
    setIsLoading(false);
  }

  return (
    <div className='flex justify-end mt-4 gap-4'>
      <Button type='button' variant={'outline'} onClick={props.closeDialog}>
        <TrashIcon className='w-6 h-6' />
        Cancel
      </Button>
      <Button type='button' variant={'destructive'} onClick={deleteTask}>
        {isLoading ? (
          <LoaderIcon className='w-6 h-6 animate-spin' />
        ) : (
          <TrashIcon className='w-6 h-6' />
        )}
        Delete
      </Button>
    </div>
  );
}
