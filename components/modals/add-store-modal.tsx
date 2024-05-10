'use client'

import * as z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import axios from 'axios'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import {
    Form,   
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCreateModal } from '@/hooks/use-create-store-modal';

import { addSwitcher } from '@/lib/reduxFeatures/templateslice';
import { useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from '@/lib/toast-method';

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Template name is required.'
    }),
})

const AddStoreModal = () => {
    const dispatch = useDispatch()
    const Router = useRouter()
    const { isOpen, onClose } = useCreateModal()
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        }
    })

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await axios.post('/api/store', values)
        .then((response:any) => {
            if (response?.data && response.data?.id) {
                const template = response.data
                form.reset()
                onClose()
                dispatch(addSwitcher({
                    key: response.data.id, value: {
                        label: template.mame,
                        value: template.id,
                        shareCode: template.shareCode
                    }
                }))
                form.reset()
                Router.push(`/template/${template.id}`)
                toastSuccess('New Store Added')
            }
        })
        .catch(() => {
            toastError('We encountered an error adding new server. Please check your network connection and try again.')
            console.error('[New Server] : cannot add new server')
        })
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }
    
    return ( 
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Add new template
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Give your new template a name
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                    >
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel
                                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                                        >
                                            template name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder='Enter template name here'
                                                className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant="primary" disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
     );
}
 
export default AddStoreModal;