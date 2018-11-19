export const simpleAction = (value) => dispatch => {
  dispatch({
    type: 'SET_PATIENT_ID',
    value
  })
}
