const ErrorMessage = ({ error }) => {

    return (
        <div className="my-3 self-center text-center">
            <p className="text-red-600">{error}</p>
        </div>
    )

}

export default ErrorMessage;