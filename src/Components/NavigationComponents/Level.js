import { getLevelProgressClass } from '../../levelUtils'

const Level = ({ level, xp}) => {

    return (
        <div className='hidden flex-col justify-around w-36 mx-2 sm:flex'>
            <div className='rounded-lg w-3/12 bg-white bg-opacity-5 self-center text-center'>{level}</div>
            <div className='rounded-full w-full bg-white bg-opacity-5 self-center text-center'>
                <div className={`rounded-full bg-green-500 text-xs leading-none py-1 ${getLevelProgressClass(level, xp)}`}></div>
            </div>
        </div>
    )

}

export default Level;