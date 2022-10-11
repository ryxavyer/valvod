import spinnerPNG from '../static/spinner.png'

const LoadingSpinner = ({ divHeight, spinnerSize }) => {

    return (
        <div className={`flex flex-col flex-wrap justify-center w-full h-${divHeight}`}>
            <div className={`animate-spin w-${spinnerSize} h-${spinnerSize} self-center text-center`}>
                <img src={spinnerPNG} alt="loading..."></img>
            </div>
        </div>
    )

}

export default LoadingSpinner;