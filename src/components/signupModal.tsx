import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@src/components/ui/dialog"
import Auth, { Page } from "./auth";
import { DialogDescription } from "@radix-ui/react-dialog";

interface SignupModalProps {
    trigger: React.ReactNode;
}

export default function SignupModal({ trigger }: SignupModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle>Sign up to get access to favorites, tags, and more!</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Auth page={Page.SIGNUP} embed/>
            </DialogContent>
        </Dialog>
    )
}
