import Swal from "sweetalert2";

export const ResponseModel = (title, type) => {
  Swal.fire({
    title,
    type,
    allowOutsideClick: false,
    confirmButtonColor: "#66B127",
  });
};
