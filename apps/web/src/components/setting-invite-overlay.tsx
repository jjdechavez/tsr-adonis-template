import { useIsMobile } from '@/hooks/use-mobile'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer'
import { useForm } from 'react-hook-form'
import type { InviteInput } from '@/types/invite'
import { Button } from './ui/button'
import { InviteForm } from './invite-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tuyau } from '@/main'
import { toast } from 'sonner'
import { useState } from 'react'

export function CreateInvite() {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const queryClient = useQueryClient()

  const form = useForm<InviteInput>({
    defaultValues: {
      email: '',
      roleId: '',
    },
  })

  const createInviteMutation = useMutation(
    tuyau.api.invites.$post.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: tuyau.api.invites.$get.pathKey(),
        })
        setOpen((prev) => !prev)
      },
    }),
  )

  const onSubmit = async (payload: InviteInput) => {
    toast.promise(
      async () => await createInviteMutation.mutateAsync({ payload }),
      {
        loading: 'Creating invite...',
        success: () => `Created successfully`,
        error: () => 'Failed to create invite',
      },
    )
  }

  return (
    <Drawer
      open={open}
      direction={isMobile ? 'bottom' : 'right'}
      onOpenChange={() =>
        form.reset({
          email: '',
          roleId: '',
        })
      }
    >
      <DrawerTrigger asChild onClick={() => setOpen((prev) => !prev)}>
        <Button variant="default">New invite</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>New Invite</DrawerTitle>
          <DrawerDescription>Invite personal information</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <InviteForm form={form} onSubmit={onSubmit} />
        </div>
        <DrawerFooter>
          <Button type="submit" form="invite-form">
            Create
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
