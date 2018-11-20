export const setPatient = (value) => dispatch => {
  dispatch({
    type: 'SET_PATIENT',
    value
  })
}
