import { useHistory } from 'react-router-dom'

const Form = () => {

const history = useHistory();

    const patientClickHandler = () =>{
        history.push("/addPatient")
        
    }

    const administerClickHandler = () => {
        history.push("/addVaccinations")
        
    }

    return(
        <div className="container">
            <div className="text-center">
          <div className="card-header">
          <h1> Vaccination App</h1>
          </div>
          {/* <br/> */}
            <div className="text-center">
                <div className="card-body">
                    <button className="btn btn-block btn-primary" onClick={patientClickHandler}>ADD PATIENT</button>
                </div>
                {/* <hr/> */}
                <div className="card-body">
                    <button className="btn btn-block btn-primary" onClick={administerClickHandler}>ADMINISTER</button>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Form;