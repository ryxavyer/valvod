import { useState } from 'react';
import motivationPNG from '../../static/motivation.png'

const NotificationPing = () => {
    const [hasUnread, setHasUnread] = useState(false)

    return (
        <div>
            <span className="animate-ping-slow absolute inline-flex h-3 w-3 mx-6 -my-3 rounded-full bg-routyneGoldLight opacity-75"></span>
            <span className="absolute inline-flex rounded-full h-3 w-3 mx-6 -my-3 bg-routyneGold"></span>
        </div>
    )
}

const MotivationModal = ({ setIsOpen }) => {
    return (
        <div className='w-5/6 h-auto bg-defaultBody rounded fixed border-2 border-itemColor top-20 left-[10%] z-[100] md:w-3/6 md:left-[40%]'>
            <div className='flex flex-row'>
                <div className='text-xl ml-7 my-4'>Latest Motivation</div>
                <button className='text-xs w-8 h-8 absolute right-0 bg-white bg-opacity-0 hover:bg-opacity-5' onClick={() => setIsOpen(false)}>X</button>
            </div>
            <div className='flex flex-col'>
                <div className='w-11/12 h-auto mb-4 px-4 py-2 rounded bg-white bg-opacity-5 self-center text-md align-middle'>
                    <div class="text-xs float-right">
                        now
                    </div>
                    <div className='flex flex-row'>
                        <div>ryxavyer believes in you</div>
                    </div>
                </div>
                <div className='w-11/12 h-auto mb-4 px-4 py-2 rounded bg-white bg-opacity-5 self-center text-md align-middle'>
                    <div class="text-xs float-right">
                        2 hours ago
                    </div>
                    <div className='flex flex-row'>
                        <div>emmapool is proud of you</div>
                    </div>
                </div>
                <div className='w-11/12 h-auto mb-4 px-4 py-2 rounded bg-white bg-opacity-5 self-center text-md align-middle'>
                    <div class="text-xs float-right">
                        Yesterday
                    </div>
                    <div className='flex flex-row'>
                        <div>klayt22 admires your work ethic</div>
                    </div>
                </div>
            </div>
            <div className='my-2'></div>
        </div>
    )
}

const Motivation = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => {
        isOpen ? setIsOpen(false) : setIsOpen(true)
    }

    return (
        <div>
            <button onClick={() => toggleOpen()}>
                <div className='flex flex-row rounded bg-white bg-opacity-5 self-center px-2 py-2 mx-2'>
                    <NotificationPing/>
                        <img className='w-6' src={motivationPNG} alt="Motivation"></img>
                </div>
            </button>
            {isOpen && <MotivationModal setIsOpen={setIsOpen}/>}
        </div>
    )

}

export default Motivation;