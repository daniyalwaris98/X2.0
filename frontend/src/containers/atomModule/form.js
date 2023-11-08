import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Grid from "@mui/material/Grid";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Form = () => {
  const foodGroups = [
    { label: "Chocolate", value: "chocolate" },
    { label: "Strawberry", value: "strawberry" },
    { label: "Vanilla", value: "vanilla" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px" }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item>
            <div
              style={{
                marginBottom: "10px",
                display: "block",
                textAlign: "start",
              }}
            >
              <div>
                <label htmlFor="email">IP Address: </label>
              </div>
              <input
                id="email"
                type="email"
                placeholder="IP Address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.email?.message}
              </div>
            </div>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <div style={{ marginBottom: "10px", textAlign: "start" }}>
              <div>
                <label htmlFor="password">Password: </label>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <button type="button" onClick={togglePasswordVisibility}>
                {!showPassword ? "Show" : "Hide"} Password
              </button>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.password?.message}
              </div>
            </div>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <div style={{ marginBottom: "10px", textAlign: "start" }}>
              <div>
                <label htmlFor="role">Role: </label>
              </div>
              <select {...register("role", { required: "Role is required" })}>
                <option value="">Select a role</option>
                <option value="Manager">Manager</option>
                <option value="Developer">Developer</option>
                <option value="Executive">Executive</option>
              </select>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.role?.message}
              </div>
            </div>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <div
              style={{
                textAlign: "start",
              }}
            >
              <div>
                <label>Gender: </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    {...register("gender", { required: "Gender is required" })}
                    value="male"
                  />{" "}
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    {...register("gender", { required: "Gender is required" })}
                    value="female"
                  />{" "}
                  Female
                </label>
              </div>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.gender?.message}
              </div>
            </div>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <div
              style={{
                textAlign: "start",
              }}
            >
              <div>
                <label htmlFor="date">Date (YYYY-MM-DD): </label>
              </div>
              <input
                id="date"
                type="date"
                {...register("date", {
                  required: "Date is required",
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}$/,
                    message: "Invalid date format (YYYY-MM-DD)",
                  },
                  validate: {
                    validDate: (date) => {
                      const parsedDate = Date.parse(date);
                      return !isNaN(parsedDate) || "Invalid date";
                    },
                    futureDate: (date) => {
                      const currentDate = new Date();
                      const inputDate = new Date(date);
                      return (
                        inputDate > currentDate || "Date must be in the future"
                      );
                    },
                  },
                })}
              />
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.date?.message}
              </div>
            </div>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <div
              style={{
                textAlign: "start",
              }}
            >
              <div>
                <label htmlFor="flavor">Multi Select: </label>
              </div>
              <Controller
                control={control}
                name="flavor"
                rules={{
                  required: "Flavor is required",
                  validate: (selectedOptions) => {
                    const selectedRole = getValues("role");
                    if (
                      selectedRole === "Developer" &&
                      selectedOptions.some(
                        (option) => option.value === "vanilla"
                      )
                    ) {
                      return "Vanilla cannot be selected for Developers";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <Select {...field} isMulti options={foodGroups} />
                )}
              />
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.flavor?.message}
              </div>
            </div>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>xs=8</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>xs=8</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>xs=8</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>xs=8</Item>
        </Grid>
      </Grid>

      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
