import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";


const GET_Patients_Name = gql`
query{
  patients{
    id
    name
    DOB
  }
}
  `;

const GET_ADMINISTER_DETAILS = gql`
query{
  administers{
    name 
    age 
    vaccine
    dueDate 
    brand
    hospital 
    complete
  }
}
  `;


const Search_Patients_Name = gql`
  query onSearchPatient($name : String!) {
    patientName(search:{ name: $name }){
      name
      gender
      DOB
      POB
    }
  }
  `;


const CREATE_ADMINISTER_MUTATION = gql`
  mutation onCreateAdministerMutation($name : String!, $DOB : String!, $vaccine : String! ,
     $dateAdministered : String! ,$brand : String ,$hospital : String, $age :Int , 
     $dueDate :String ,$complete : String) {

    createAdminister(data:{
      name : $name
      DOB : $DOB
      vaccine : $vaccine
      dateAdministered : $dateAdministered
      brand : $brand
      hospital : $hospital
      age : $age
      dueDate : $dueDate
      complete : $complete

    }){
      name , DOB, vaccine , dateAdministered ,brand , hospital
    }
  }`



const AddVaccination = () => {

  const date = new Date().getDate();
  // console.log(`2022-04-0${date}`);


  const { loading: getPatientsLoading, error: getPatientsError, data: patientsData } = useQuery(GET_Patients_Name)
  const { loading: getDetailsLoading, error: getDetailsError, data: AdministerDetails } = useQuery(GET_ADMINISTER_DETAILS)
  const [fetchPatientData, { loading: getPatientNameLoading, error: getPatientNameError, data: patientNameData }] = useLazyQuery(Search_Patients_Name)
  let [createAdministerCallback, { loading: getAdministerLoading, error: getAdministerError, data: administerData }] = useMutation(CREATE_ADMINISTER_MUTATION, {
    variables: {
      name: '',
      DOB: '',
      vaccine: '',
      dateAdministered: '', 
      brand: '',
      hospital: '',
      age : 0,
      dueDate : '',
      complete : ''
    }
  })
  // console.log("Data", patientsData);

  // console.log("Administer details", AdministerDetails);

  const name = AdministerDetails?.administers.map((ad : any) => ad.name);
  // console.log(name);


  const DateOfBirth = new Date(patientNameData?.patientName.DOB).toLocaleDateString()
  //  console.log("DateOfBirth",DateOfBirth);


  let diff =(new Date().getTime() - new Date(DateOfBirth).getTime()) / 1000;
  diff /= (60 * 60 * 24);
 const age = Math.abs(Math.round(diff/365.25));
//  console.log(age);
 

  const [selectedName, setSelectedName] = useState<string>('');
  const [selectedVaccine, setSelectedVaccine] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedHospital, setSelectedHospital] = useState<string>('');


  

  const nameBlurHandler: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    event.preventDefault()
    // console.log("selectedname" , selectedName);
    fetchPatientData({ variables: { name: selectedName } })
  }

  // console.log("selectedVaccine ->",selectedVaccine);
let dueDate :string = '';
let complete :string = '';
if(selectedVaccine === "None"){
  dueDate = new Date (selectedDate).toDateString();
  complete = "Not Vaccinated"
}else if(selectedVaccine === "Dose1"){
  dueDate  = new Date(new Date(selectedDate).setMonth(new Date(selectedDate).getMonth()+3)).toDateString()
  complete = "2nd Dose Remainng"
}else if(selectedVaccine === "Dose2"){
  dueDate = "-";
  complete = "Completely Vaccinated"
}
//  console.log("date" ,new Date(new Date(selectedDate).setMonth(new Date(selectedDate).getMonth()+3)).toDateString());
 


  const saveClickHandler = (event: React.FormEvent) => {
    event.preventDefault()
    // console.log(selectedName, DateOfBirth, selectedVaccine, selectedBrand, selectedDate, selectedHospital, dueDate,age,complete);
    createAdministerCallback({
      variables: {
        name: selectedName,
        DOB: DateOfBirth,
        vaccine: selectedVaccine,
        dateAdministered: selectedDate,
        brand: selectedBrand,
        hospital: selectedHospital,
        age : age ,
        dueDate ,
        complete 
      }
    }).then(res => {
      // history.replace("/")
      alert(" saved successfully!")
      window.location.reload();
    }).catch(err => {
      alert("Enter details correctly to proceed")
    })

  
  }

  


  // console.log("name =>",patientNameData?.patientName.DOB);

  if (getPatientsLoading) return <p>Loading</p>;
  if (getPatientsError || getPatientNameError || getAdministerError || getDetailsError) return <p>{getPatientNameError?.message}</p>;

  return (
    <div className="row">

      <div className="col-6 offset-3">
        <div className="card">
          <div className="card-header">
            <h4 className="text-center">Vaccination Form</h4>
          </div>
          <div className="card-body">
            <form  >
              {/* name */}
              <div className="form-group">
                <label htmlFor="name">Name Of Patient :</label>
                <select id="name" name="name" className="form-control"
                  onChange={e => setSelectedName(e.currentTarget.value)}
                  onBlur={nameBlurHandler} >
                  <option value="-">-</option>
                  {patientsData.patients.map((patient: any) => (
                    <option key={patient.id} value={patient.name}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>
              <br />
              {/* DateOfBirth */}
              <div className="form-group ">
                <label htmlFor="name">Date Of Birth :</label>
                <input className="form-control" name="DOB" defaultValue={patientNameData?.patientName.DOB} readOnly />
              </div>
              <br />
              {/* Vaccination */}
              <div className="form-group">
                <label htmlFor="vaccination">Vaccines taken :</label>
                <select name="vaccines"
                  className="form-control"
                  onChange={e => setSelectedVaccine(e.target.value)}>
                  <option value="-">-</option>
                  <option value="None">None</option>
                  <option value="Dose1">Dose 1</option>
                  <option value="Dose2">Dose 2</option>
                </select>
              </div>
              <br />
              {/* date administer */}
              <div className="form-group">
                <label htmlFor="dateOfVaccine">Date Administered :</label>
                <input className="form-control" type="date" onChange={e => setSelectedDate(e.currentTarget.value)} max={`2022-04-0${date}`}></input>
              </div>
              <br />
              {/* brand name */}
              <div className="form-group">
                <label htmlFor="brand">Brand Name :</label>
                <input className="form-control" onChange={e => setSelectedBrand(e.target.value)} type="text"></input>
              </div>
              <br />
              {/* hospital name */}
              <div className="form-group">
                <label htmlFor="hospital">Given At(Hospital Name) :</label>
                <select name="hos[ital" onChange={e => setSelectedHospital(e.currentTarget.value)}
                  className="form-control">
                  <option value="-">-</option>
                  <option value="hospital1">Private</option>
                  <option value="hospital2">Goverment</option>
                  
                </select>
                <br />
                {/* buttons */}
                <div className="row">
                  <div className="col-6">
                    <button type="submit" className="form-control btn-primary" onClick={saveClickHandler}>SUBMIT</button>

                  </div>
                  <div className="col-6">
                    <button type="reset" className=" form-control btn btn-block btn-danger" >CANCAL</button>
                  </div>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
      <hr />
      <div className="container">
        <div className="form-group form-control ">
          <div className="card-header">
            <h4 className="text-center">Vaccination Card</h4>
          </div>
          <div className="card-body">
            <Table striped bordered hover >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name Of Patient</th>
                  <th>Age</th>
                  <th>Vaccine</th>
                  <th>Due Date</th>
                  <th>Brand Name</th>
                  <th>Hospital Name</th>
                  <th>Vaccination Status</th>
                </tr>
              </thead>
              <tbody>
              {AdministerDetails?.administers.map((item : any) => (
        <tr key={item.name}>
          {Object.values(item).map((val : any) => (
            <td key={val.name}>{val}</td>  
          ))}
        </tr>
      ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddVaccination;