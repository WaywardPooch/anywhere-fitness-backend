const router = require("express").Router()
const FitnessClass = require("./fitness-classes-model")
const { checkFitnessClassId } = require("../middleware/check-fitness-class-id")
const { validateNewFitnessClass } = require("../middleware/validate-class")
const decodeToken = require("../auth/token-decoder")
const { JWT_SECRET } = require("../../config")

router.get("/",
  async (req, res, next) => {
    try {
      const fitnessClasses = await FitnessClass.getAll()
      res.status(200).json(fitnessClasses)
    } catch (err) {
      next()
    }
  }
)

router.get("/:id",
  checkFitnessClassId,
  async (req, res, next) => {
    try {
      const fitnessClass = req.custom_class
      res.status(200).json(fitnessClass)
    } catch (err) {
      next()
    }
  }
)

router.post("/",
  validateNewFitnessClass,
  async (req, res, next) => {
    try {
      const token = req.headers.authorization
      const userInfo = decodeToken(token, JWT_SECRET)

      const nc = req.body
      let classInfo = {
        category_id: nc.type,
        class_name: nc.name,
        instructor_id: userInfo.user_id,
        intensity: nc.intensity,
        location: nc.location,
        start_time: nc.start_time
      }
      if (nc.duration) {
        classInfo.duration = nc.duration
      }
      else if (nc.max_class_size) {
        classInfo.max_class_size = nc.max_class_size
      }

      const fitnessClass = await FitnessClass.add(classInfo)
      res.status(201).json({
        message: "Class created successfully!",
        newClass: fitnessClass
      })
    } catch (err) {
      next()
    }
  }
)

module.exports = router
