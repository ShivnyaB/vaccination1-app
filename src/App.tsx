import React, { Fragment } from 'react';
import Form from './Components/Form/Form';
import { Switch , Route} from 'react-router-dom'
import AddPatient from './Components/Add-Patient/AddPatient';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import AddVaccination from './Components/AdministerVaccination/Adminster';

const client = new ApolloClient({
  uri: "http://localhost:9090/gq",
  cache : new InMemoryCache()
})



function App() {
 
  return (
   <Fragment>
   
     <div className="container">
     <Switch> 
    
          <Route path="/" exact>
             <Form />
          </Route>
          <Route path="/addPatient" exact>
          <ApolloProvider client={client}>
            <AddPatient/>
            </ApolloProvider>
          </Route>
          <Route path="/addVaccinations" exact>
          <ApolloProvider client={client}>
            <AddVaccination />
            </ApolloProvider>
          </Route>
    
     </Switch>
     </div>
   </Fragment>
  );
}



export default App;