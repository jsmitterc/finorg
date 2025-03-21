import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Select, MenuItem, FormControlLabel, Checkbox, FormControl, InputLabel, Container, Grid } from "@mui/material";

interface Props {
    schema: any[],
    onSubmit: (e: any) => void
}
const DynamicForm = ({ schema, onSubmit }: Props) => {

  const defaultValues = schema.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || (field.type === "checkbox" ? false : "");
    return acc;
  }, {});

  const { control, register, handleSubmit, formState: { errors } } = useForm({
    defaultValues
  });


  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {schema.map((field) => (
            <Grid item xs={12} key={field.name}>
              {field.type === "text" || field.type === "number" ? (
                <TextField
                  {...register(field.name, { required: field.required })}
                  type={field.type}
                  fullWidth
                  InputProps={{ readOnly: field.readOnly }}
                  defaultValue={field.defaultValue !== undefined ? String(field.defaultValue) : ""}
                  error={!!errors[field.name]}
                  helperText={errors[field.name] ? `${field.label} is required` : ""}
                />
              ) : field.type === "select" ? (
                <FormControl fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Controller
                    name={field.name}
                    control={control}
                    defaultValue={field.defaultValue}
                    rules={{ required: field.required }}
                    render={({ field: controllerField }) => (
                      <Select {...controllerField}>
                        {field.options.map(({ key, label }: {key: string, label: string}) => (
                          <MenuItem key={key} value={key}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              ) : field.type === "checkbox" ? (
                <FormControlLabel
                  control={
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: controllerField }) => <Checkbox {...controllerField} />}
                    />
                  }
                  label={field.label}
                />
              ) : null}
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default DynamicForm;