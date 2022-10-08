import Motivation from './Motivation'
import Logout from './Logout'
import Username from './Username'
import Level from './Level'

const GoldDivider = () => {
    return (
        <div className='hidden w-0.5 h-2/12 mx-2 rounded bg-routyneGold sm:block'></div>
    )
}

const Navigation = ({ username, status, level, xp, handleStatusUpdate, setError }) => {
    return (
        <div className='flex flex-row border-routyneGold border-b-2 py-2'>
            <div className='self-center text-center mx-8 text-3xl'>routyne</div>
            <div className='flex flex-row justify-end w-full h-1/4 shadow-sm py-5 px-5'>
                <Level level={level} xp={xp}/>
                {/* <Motivation/> */}
                <Username username={username} status={status}/>
                <GoldDivider/>
                <Logout handleStatusUpdate={handleStatusUpdate} setError={setError}/>
            </div>
        </div>
      )
}

export default Navigation;