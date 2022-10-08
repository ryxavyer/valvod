import { useState } from 'react';
import { getStatusImg } from '../status';

export const Friends = (session) => {
    const [formOpen, setFormOpen] = useState(false)
    const [friendInput, setFriendInput] = useState("")
    const { user } = session

    const toggleFormOpen = () => {
        setFormOpen(!formOpen)
    }

    const updateFriendInput = (e) => {
        setFriendInput(e.target.value)
    }

    const validateFriendInput = () => {
        return
    }

    return (
        <div className='hidden my-8 flex-col w-2/4 h-screen bg-defaultBody z-[100] md:w-1/4 md:flex'>
            <div className='flex flex-row'>
                <div className='text-xl ml-7 my-2'>Friends</div>
                <button className='w-10 h-6 absolute top-[140px] right-6 text-md text-center rounded bg-white bg-opacity-5 hover:bg-opacity-10' onClick={() => toggleFormOpen()}>+</button>
            </div>
            <div className='flex flex-col mx-6'>
                {formOpen &&
                <form className="flex flex-row">
                    <input className="bg-transparent w-full border-b-2 self-center py-1 placeholder:text-white placeholder:text-sm focus:outline-none placeholder:opacity-50" placeholder='Add a friend by username...' value={friendInput} onChange={(e) => updateFriendInput(e)}></input>
                    <button type='submit' hidden className="w-24 rounded-lg bg-routyneGold self-center py-2 hover:bg-routyneGoldLight">ADD</button>
                </form>}
                <div className='flex flex-row'>
                    <div className='w-full h-auto mb-4 px-2 py-2 rounded bg-white bg-opacity-5 self-center text-md align-middle'>
                        <div className="text-xs mr-2 float-left">
                            {getStatusImg("online")}
                        </div>
                        <div className='flex flex-col mr-2'>
                            <div>ryxavyer</div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='w-full h-auto mb-4 px-2 py-2 rounded bg-white bg-opacity-5 self-center text-md align-middle'>
                        <div className="text-xs mr-2 float-left">
                            {getStatusImg("working")}
                        </div>
                        <div className='flex flex-col mr-2'>
                            <div>emmapool</div>
                            <p className='text-xs ml-px'>M2M</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='w-full h-auto mb-4 px-2 py-2 rounded bg-white bg-opacity-5 self-center text-md align-middle'>
                        <div className="text-xs mr-2 float-left">
                            {getStatusImg("offline")}
                        </div>
                        <div className='flex flex-col mr-2'>
                            <div>klayt22</div>
                            <p className='text-xs ml-px'>request pending</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='my-2'></div>
        </div>
    )
}

export default Friends;