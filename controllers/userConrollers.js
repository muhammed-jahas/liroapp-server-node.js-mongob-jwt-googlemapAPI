const userRegister = async (req, res) => {
    try {
      const { username, password } = req.body;
      const isUserExist = await User.findOne({ username: username.trim() });
      if (isUserExist) {
        return res.status(400).json({ message: "username already exist" });
      }
      const hashedPassword = await bcrypt.hash(password.trim(), 12);
      const user = new User({
        username: username.trim(),
        password: hashedPassword,
      });
      await user.save();
      const token = jwt.sign({ user: "user" }, process.env.JWT_SECRET);
      res.status(201).json({
        status: "success",
        message: "User signed up successfully",
        user: user.username,
        userId: user.id,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const userLogin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const isUserExist = await User.findOne({ username: username.trim() });
      if (isUserExist) {
        console.log(isUserExist);
        const validpassword = await bcrypt.compare(password, isUserExist.password );
        if (validpassword) {
          console.log(validpassword,"vald");
          const token = jwt.sign({ user: "user" }, process.env.JWT_SECRET);
          res.status(200).json({
            status:"success",
            message: "User signed in successfully",
            user: isUserExist.username,
            userId: isUserExist.id,
            token,
          });
        } else {
          res.status(400).json({ message: "Incorrect password" });
        }
      } else {
        res.status(400).json({ message: "User not exist" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  export { userLogin, userRegister, };