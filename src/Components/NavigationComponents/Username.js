import { getStatusImg } from '../../status'

const Username = ({ username, status }) => {

    return (
        <div className='hidden flex-row rounded bg-white bg-opacity-5 self-center px-2 py-2 mx-2 sm:flex'>
            {getStatusImg(status)}
            <div className=' mx-1 self-center'>{username ? username : ""}</div>
        </div>
    )

}

export default Username;