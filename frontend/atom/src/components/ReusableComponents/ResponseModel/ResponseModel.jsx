import Swal from "sweetalert2";

export const ResponseModel = (title, type, errors) => {
  Swal.fire({
    title,
    type,
    allowOutsideClick: false,
    confirmButtonColor: "#66B127",
    html:
      errors &&
      `
      <article>${errors.map((err, index) => {
        return `<p key=${index}>${err}</p>`;
      })}</article>`,
  });
};
