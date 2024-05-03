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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toastError } from '@/lib/toast-method';

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Template name is required.'
    }),
})

const CreateStoreModal = () => {
    const [isMounted, setIsMounted] = useState(false)

    const Router = useRouter()

    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        }
    })

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/store', values)

            form.reset()
            Router.refresh()
            window.location.reload()
        } catch (error) {
            toastError('We encountered an error creating first server. Please check your network connection and try again.')
            console.error('[Create Server] : cannot create server')
        }
    }
    
    if (!isMounted) {
        return null
    }
    
    return ( 
        <Dialog open>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Create your template
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Give your template a name
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
 
export default CreateStoreModal;