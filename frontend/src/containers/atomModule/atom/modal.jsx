import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import FormModal from "../../../components/dialog";
import Label from "../../../components/labels";
import Input from "../../../components/input";
import DefaultWrapper from "../../../components/wrappers";
import { InputWrapper } from "../../../components/wrappers";
import Grid from "@mui/material/Grid";
import DefaultSelect from "../../../components/selects";

const Index = ({ handleClose, open, setOpen }) => {
  const foodGroups = [
    { label: "Chocolate", value: "chocolate" },
    { label: "Strawberry", value: "strawberry" },
    { label: "Vanilla", value: "vanilla" },
  ];

  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  const validateEmail = (value) => {
    if (!value.endsWith(".com")) {
      return "Email must end with '.com'";
    }
    return true;
  };

  const validateDateFormat = (date) => {
    const regex = /^\d{4}-\d{2}\-\d{2}$/;
    return regex.test(date) || "Invalid date format (YYYY-MM-DD)";
  };

  const validateDate = (date) => {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate) || "Invalid date";
  };

  const validateFutureDate = (date) => {
    const currentDate = new Date();
    const inputDate = new Date(date);
    return inputDate > currentDate || "Date must be in the future";
  };

  return (
    <FormModal
      title="Add Atom"
      submitText="Submit"
      open={open}
      setOpen={setOpen}
      handleClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="ip_address" required>
                Ip Address:
              </Label>
              <InputWrapper>
                <Input
                  id="ip_address"
                  placeholder="Ip Address"
                  type="text"
                  {...register("ip_address", {
                    required: "Ip address is required.",
                  })}
                />
              </InputWrapper>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.ip_address?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="site_name" required>
                Site Name:{" "}
              </Label>
              <InputWrapper>
                <DefaultSelect
                  sx={{ width: "195px" }}
                  id="site_name"
                  {...register("site_name", {
                    required: "Site name is required",
                  })}
                >
                  <option style={{ color: "red" }} value="">
                    Select a site
                  </option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Executive">Executive</option>
                </DefaultSelect>
              </InputWrapper>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.site_name?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="rack_name" required>
                Rack Name:{" "}
              </Label>
              <InputWrapper>
                <Input
                  id="rack_name"
                  placeholder="Rack Name"
                  type="text"
                  {...register("rack_name", {
                    required: "Rack name is required.",
                  })}
                />
              </InputWrapper>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.rack_name?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="device_name" required>
                Device Name:{" "}
              </Label>
              <InputWrapper>
                <Input
                  id="device_name"
                  placeholder="Device Name"
                  type="text"
                  {...register("device_name", {
                    required: "Device name is required",
                  })}
                />
              </InputWrapper>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.device_name?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="device_ru" required>
                Device RU:{" "}
              </Label>
              <InputWrapper>
                <Input
                  id="device_ru"
                  placeholder="Device RU"
                  type="text"
                  {...register("device_ru", {
                    required: "Device ru is required",
                  })}
                />
              </InputWrapper>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.device_ru?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="department">Department:</Label>
              <InputWrapper>
                <Input
                  id="department"
                  placeholder="Department"
                  type="text"
                  {...register("department", {})}
                />
              </InputWrapper>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.department?.message}
              </div>
            </DefaultWrapper>

            {/* <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="password">Password: </Label>
              <InputWrapper>
                <Input
                  id="password"
                  placeholder="Enter Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    // pattern: {
                    //   value:
                    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/,
                    //   message:
                    //     "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 9 characters long.",
                    // },
                  })}
                />
              </InputWrapper>
              &nbsp;
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                {!showPassword ? "Show" : "Hide"} Password
              </button>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.password?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="role">Role: </Label>
              <InputWrapper>
                <select
                  id="role"
                  {...register("role", { required: "Role is required" })}
                >
                  <option value="">Select a role</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Executive">Executive</option>
                </select>
              </InputWrapper>

              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.role?.message}
              </div>
            </DefaultWrapper> */}
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="section">Section:</Label>
              <InputWrapper>
                <Input
                  id="section"
                  placeholder="Section"
                  type="text"
                  {...register("section", {})}
                />
              </InputWrapper>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.section?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="function" required>
                Function:{" "}
              </Label>
              <InputWrapper>
                <Input
                  id="function"
                  placeholder="Function"
                  type="text"
                  {...register("function", {
                    required: "Function is required",
                  })}
                />
              </InputWrapper>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.function?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="virtual">Virtual:</Label>
              <InputWrapper>
                <Input
                  id="virtual"
                  placeholder="Virtual"
                  type="text"
                  {...register("virtual", {
                    required: "Virtual is required",
                  })}
                />
              </InputWrapper>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.virtual?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="device_type" required>
                Device Type:{" "}
              </Label>
              <InputWrapper>
                <Input
                  id="device_type"
                  placeholder="Device type"
                  type="text"
                  {...register("device_type", {
                    required: "Device type is required",
                  })}
                />
              </InputWrapper>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.device_type?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="password_group" required>
                Password Group:{" "}
              </Label>
              <InputWrapper>
                <Input
                  id="password_group"
                  placeholder="Password Group"
                  type="text"
                  {...register("password_group", {
                    required: "Password group is required",
                  })}
                />
              </InputWrapper>
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.password_group?.message}
              </div>
            </DefaultWrapper>

            {/* <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="male">Male: </Label>
              <InputWrapper>
                <Input
                  id="male"
                  type="radio"
                  value="male"
                  {...register("gender", {
                    required: "Gender is required",
                  })}
                />
              </InputWrapper>
              &nbsp; &nbsp; &nbsp;
              <Label htmlFor="female">Female: </Label>
              <Input
                id="female"
                type="radio"
                value="female"
                {...register("gender", {
                  required: "Gender is required",
                })}
              />
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.gender?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="date">Date (YYYY-MM-DD): </Label>
              <InputWrapper>
                <Input
                  id="date"
                  placeholder="Enter Date"
                  type="date"
                  {...register("date", {
                    required: "Date is required",
                    validate: {
                      format: validateDateFormat,
                      validDate: validateDate,
                      futureDate: validateFutureDate,
                    },
                  })}
                />
              </InputWrapper>

              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.date?.message}
              </div>
            </DefaultWrapper>

            <DefaultWrapper sx={{ marginBottom: "10px" }}>
              <Label htmlFor="flavor">Multi Select: </Label>
              <InputWrapper>
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
                    <Select
                      {...field}
                      classNames={{
                        valueContainer: () => "rounded-full",
                        container: () =>
                          "shadow-none rounded-lg border-lightGray",
                        indicatorSeparator: () => "hidden",
                        input: () => "h-10",
                        singleValue: () => "rounded-full",
                      }}
                      placeholder="Select Flavors"
                      isMulti
                      options={foodGroups}
                      className="bg-white border appearance-none w-full leading-tight focus:outline-none rounded-lg"
                    />
                  )}
                />
              </InputWrapper>

              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.flavor?.message}
              </div>
            </DefaultWrapper> */}
          </Grid>
          {/* <Grid item xs={12}>
            <button type="submit">submit</button>
          </Grid> */}
        </Grid>
      </form>
    </FormModal>
  );
};

export default Index;
