import { Form, FormField } from '@/components/ui/form';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PlusIcon } from 'lucide-react';

interface InputFormProps {
  refresh: () => void;
  sessionId?: string;
}

const formSchema = z.object({
  content: z.string(),
});

export function InputForm(props: InputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await fetch('/tasks', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${props.sessionId}`,
      },
      body: JSON.stringify(values),
    });
    props.refresh();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <InputGroup>
                <InputGroupInput
                  placeholder='Create new task'
                  {...field}
                  autoComplete='off'
                />
                <InputGroupAddon align='inline-end'>
                  <InputGroupButton variant='secondary' type='submit'>
                    <PlusIcon className='w-6 h-6' />
                    <span className='font-bold'>Add task</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
