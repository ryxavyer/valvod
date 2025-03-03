'use client'
import React, { useState, useEffect, useRef, FormEvent } from "react"
import { MessageSquare, Bug, ArrowLeft, Ellipsis, Lightbulb, CircleCheck, LoaderCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

enum FEEDBACK_MODAL_WINDOWS {
    MENU = "menu",
    BUG = "bug",
    IDEA = "idea",
    OTHER = "other",
    THANKS = "thanks",
}

interface FeedbackModalProps {
    className?: string
}

const FeedbackModal = ({ className }: FeedbackModalProps) => {
    const modalWrapperRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [window, setWindow] = useState(FEEDBACK_MODAL_WINDOWS.MENU)
    const [feedback, setFeedback] = useState("")
    const [error, setError] = useState("")
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const toggleOpen = () => {
        if (!isOpen) {
            setIsOpen(true)
            if (window == FEEDBACK_MODAL_WINDOWS.THANKS) {
                // reset to menu if re-opened after thanks
                setWindow(FEEDBACK_MODAL_WINDOWS.MENU)
            }
        } else {
            setIsOpen(false)
        }
    }

    const handleClose = () => {
        setError("")
        setIsOpen(false)
    }

    const handleWindowUpdate = (newWindow: FEEDBACK_MODAL_WINDOWS) => {
        setError("")
        setWindow(newWindow)
    }

    const handleClickOutside = (e: Event) => {
        if (
            modalWrapperRef.current &&
            !modalWrapperRef.current.contains(e.target)
        ) {
            handleClose()
        }
    }

    const submitFeedback = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSending(true)
        if (
            !feedback ||
            window === FEEDBACK_MODAL_WINDOWS.MENU ||
            window === FEEDBACK_MODAL_WINDOWS.THANKS
        ) {
            setIsSending(false)
            return
        }
        const feedbackObj = {
            message: feedback,
            type: window,
        }
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedbackObj),
            });
            const data = await response.json();
            if (!response.ok) {
                setError("Uh oh, that didn't go through. Please try again.")
            } else {
                setWindow(FEEDBACK_MODAL_WINDOWS.THANKS);
            }
        } catch (error) {
            setError("Uh oh, that didn't go through. Please try again.")
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div ref={modalWrapperRef} className="z-50 w-full max-w-[120px]">
            <Button
                className={`${className}`}
                variant="outlineSecondary"
                onClick={(e) => {
                    toggleOpen()
                }}
            >
                <MessageSquare className="w-4 h-4 shrink-0 opacity-100 mr-2"/>
                <span className="text-md font-normal">Feedback</span>
            </Button>
            {isOpen &&
                <div className="z-50 absolute top-[80px] right-2 md:top-[80px] md:right-[35px] bg-neutral-900 border border-secondary rounded-lg flex items-center justify-center p-4 w-[470px] md:w-[500px] h-[250px]">
                {window === FEEDBACK_MODAL_WINDOWS.MENU && (
                    <div className="flex flex-col justify-between items-center w-[90%] h-[90%]">
                        <div className="w-full h-1/2">
                            <span className="text-lg">
                                How can we improve?
                            </span>
                        </div>
                        <div className="flex flex-row justify-between w-full">
                            <Button
                                variant="outline"
                                className="flex-col py-16 w-[125px]"
                                onClick={() =>
                                    handleWindowUpdate(
                                        FEEDBACK_MODAL_WINDOWS.BUG,
                                    )
                                }
                            >
                                <Bug className="w-6 h-6 shrink-0 opacity-100 mb-2"/>
                                Bug
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-col py-16 w-[125px]"
                                onClick={() =>
                                    handleWindowUpdate(
                                        FEEDBACK_MODAL_WINDOWS.IDEA,
                                    )
                                }
                            >
                                <Lightbulb className="w-6 h-6 shrink-0 opacity-100 mb-2"/>
                                Idea
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-col py-16 w-[125px]"
                                onClick={() =>
                                    handleWindowUpdate(
                                        FEEDBACK_MODAL_WINDOWS.OTHER,
                                    )
                                }
                            >
                                <Ellipsis className="w-6 h-6 shrink-0 opacity-100 mb-2"/>
                                Other
                            </Button>
                        </div>
                    </div>
                )}
                {(window === FEEDBACK_MODAL_WINDOWS.BUG || window === FEEDBACK_MODAL_WINDOWS.IDEA || window === FEEDBACK_MODAL_WINDOWS.OTHER) && (
                    <div className="flex flex-col items-center justify-between w-[90%] h-[90%]">
                        <div className="flex flex-row items-center w-full">
                            <Button
                                variant="ghost"
                                className="p-2"
                                onClick={() =>
                                    handleWindowUpdate(
                                        FEEDBACK_MODAL_WINDOWS.MENU,
                                    )
                                }
                            >
                                <ArrowLeft className="w-6 h-6 shrink-0 opacity-100"/>
                            </Button>
                            <div className="flex flex-row w-[80%] justify-center items-center">
                                {
                                    window === FEEDBACK_MODAL_WINDOWS.BUG ? <Bug className="w-6 h-6 shrink-0 opacity-100 mr-2"/> : window === FEEDBACK_MODAL_WINDOWS.IDEA ? <Lightbulb className="w-6 h-6 shrink-0 opacity-100 mr-2"/> : <Ellipsis className="w-6 h-6 shrink-0 opacity-100 mr-2"/>
                                }
                                <span>
                                    {window === FEEDBACK_MODAL_WINDOWS.BUG ? "Report a Bug" : window === FEEDBACK_MODAL_WINDOWS.IDEA ? "Share An Idea" : "Tell Us Anything!"}
                                </span>
                            </div>
                        </div>
                        <form
                            className="w-full flex flex-col items-center justify-between space-y-4"
                            onSubmit={submitFeedback}
                        >
                            <Textarea
                                className="w-full resize-none"
                                placeholder={
                                    window === FEEDBACK_MODAL_WINDOWS.BUG ? "I noticed an issue when..." : window === FEEDBACK_MODAL_WINDOWS.IDEA ? "I would love..." : "What would you like us to know?"
                                }
                                onChange={(e) =>
                                    setFeedback(e.target.value)
                                }
                            />
                            <Button
                                type="submit"
                                disabled={isSending || !feedback}
                                variant="default"
                            >
                                {isSending ? (
                                    <LoaderCircle className="w-6 h-6 shrink-0 opacity-100 animate-spin"/>
                                ) : (
                                    "Send Feedback"
                                )}
                            </Button>
                            {error && (
                                <span className="text-xs text-destructive">
                                    {error}
                                </span>
                            )}
                        </form>
                    </div>
                )}
                {window === FEEDBACK_MODAL_WINDOWS.THANKS && (
                    <div className="flex flex-col items-center justify-between w-[90%] h-[60%]">
                        <div className="flex flex-col items-center justify-center w-full space-y-4">
                            <CircleCheck className="w-6 h-6 shrink-0 opacity-100 text-success"/>
                            <span>
                                Thank you! We recieved your feedback.
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() =>
                                handleWindowUpdate(
                                    FEEDBACK_MODAL_WINDOWS.MENU,
                                )
                            }
                        >
                            Back to Menu
                        </Button>
                    </div>
                )}
                </div>
            }
        </div>
    )
}

export default FeedbackModal;
