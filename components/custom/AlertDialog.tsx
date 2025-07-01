import React from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertDialogTemplateProps {
  title: string
  msg: string
  open?: boolean
  openchange?:  () => void;
}

export function AlertDialogTemplate({title,msg,open,openchange,}: AlertDialogTemplateProps) {
  return (
    <AlertDialog open={open} onOpenChange={openchange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{msg}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel >Okay</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
