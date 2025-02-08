//logic for checking the role
function checkRole(...allowedRoles) {
  return (request, response, next) => {
    const user = request.session.user;

    console.log("User session data", user); //DEBUGGNIG
    if (!user) {
      return response
        .status(401)
        .json({
          message: "Unauthorized, Become a member first by signing up!",
        });
    }

    //Allow access if user has the required role or is an admin
    if (allowedRoles.includes(user.role) || user.role === "admin") {
      return next();
    }
      return  response.status(403).json({
          message: `Access denied. Requires ${allowedRoles} or admin to access`,
        });
    };
  }

module.exports = checkRole;