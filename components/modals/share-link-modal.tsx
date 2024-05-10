'use client'

import { Check, Copy, RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useShareModal } from '@/hooks/use-share-link-modal';
import { useOrigin } from '@/hooks/use-origin';
import { useDispatch, useSelector } from 'react-redux';
import { addSwitcher } from '@/lib/reduxFeatures/templateslice';
import delayFunction from '@/lib/delayMethod';
import { toastError, toastSuccess } from '@/lib/toast-method';

const ShareLinkModal = () => {
    const { isOpen, onClose } = useShareModal()
    const {storeId} = useParams<{storeId: string}>()
    const template = useSelector((state: any) => state.userTemplate.value)
    const dispatch = useDispatch()
    const origin = useOrigin()

    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const shareUrl = `${origin}/share/${template.switcher[storeId]?.shareCode}`
    
    const onCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)

        setTimeout(() => {
           setCopied(false) 
        }, 1000);
    }

    const onNew = async () => {
        setIsLoading(true)
        await axios.patch(`/api/store/${storeId}/share-code`)
        .catch((error) => {
            toastError('We encountered an error generating new link. Please check your network connection and try again.')
            console.error('[Generate New Link] : cannot generate link template')
        })
        .then((response: any) => {
            const store = response.data
            dispatch(addSwitcher({
                key: store.id, value: {
                    label: store.name,
                    value: store.id,
                    shareCode: store.shareCode
                }
            }))
            toastSuccess('New Link Generated')
        })
        .finally( async() => {
            await delayFunction(2000)
            setIsLoading(false)
        })
    }
    
    return ( 
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Share Public Template
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Share your public template to your friends as form and data sheet-to-pdfs converter
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6">
                    <Label
                        className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                    >
                        Template link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            readOnly
                            // disabled={isLoading}
                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                            value={shareUrl}
                        />
                        <Button disabled={isLoading} onClick={onCopy} size="icon">
                            {copied
                                ? <Check className='w-4 h-4' />
                                : <Copy className='w-4 h-4' />
                            }
                        </Button>
                    </div>
                    <Button
                        onClick={onNew}
                        disabled={isLoading}
                        variant="link"
                        size="sm"
                        className='text-xs text-zinc-500 mt-4'
                    >
                        Generate a new link
                        <RefreshCw className='w-4 h-4 ml-2' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
     );
}
 
export default ShareLinkModal;