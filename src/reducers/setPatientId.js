
export default (state = {}, action) => {
 switch (action.type) {
  case 'SET_PATIENT_ID':
   return {
     ...state,
    patientId: action.value
   }
  default:
   return state
 }
}
