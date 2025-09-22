const isLoggedIn = () => !!localStorage.getItem("token");

<nav>
  <a href="/">Home</a>
  {isLoggedIn() ? (
    <>
      <a href="/dashboard">Dashboard</a>
      <a href="/logout">Logout</a>
    </>
  ) : (
    <>
      <a href="/register">Register</a>
      <a href="/login">Login</a>
    </>
  )}
</nav>
