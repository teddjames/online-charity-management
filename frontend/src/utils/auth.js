export function isDonorLoggedIn() {
  return localStorage.getItem("donor") !== null;
}
