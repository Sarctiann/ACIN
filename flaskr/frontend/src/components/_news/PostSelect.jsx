import { FormControl, Select, MenuItem } from '@mui/material'


const PostSelect = (props) => {

  const { options, option, setOption, ...others } = props

  const handleChange = (e) => {
    setOption(e.target.value)
  }

  return (
    <FormControl fullWidth {...others}>
      <Select size='small' value={option} onChange={handleChange}>
        {options.map(op => {
          return <MenuItem key={op} value={op}>{op}</MenuItem>
        })}
      </Select>
    </FormControl>
  )
}

export default PostSelect