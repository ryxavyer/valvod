import { useState } from "react";

const ToolTip = ({ content }) => {
    const [tipTimeout, setTipTimeout] = useState(null)
    const [isShowing, setIsShowing] = useState(false)

    const showTip = () => {
        setTipTimeout(
            setTimeout(() => {
                setIsShowing(true)
            }, 500)
        )
    }

    const hideTip = () => {
        clearTimeout(tipTimeout)
        setIsShowing(false)
    }

    return (
        <div className="inline relative w-6 h-full mx-1" onMouseEnter={showTip} onMouseLeave={hideTip}>
            <div className="rounded-full bg-transparent self-center text-center cursor-help border-2 border-neutral-500 text-sm">?</div>
            {isShowing &&
                <div className="absolute rounded-md w-72 -left-[8.5rem] p-4 mt-1 bg-stone-800 text-sm">
                    {content}
                </div>
            }
        </div>
    )

}

export default ToolTip;