
export default (state = {}, action) => {
 switch (action.type) {
  case 'SET_PATIENT':
   return {
     ...state,
    patient: action.value
   }
  default:
   return state
 }
}
