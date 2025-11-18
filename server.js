import express from "express"
import multer from "multer"
import { createClient } from "@supabase/supabase-js"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

// ✅ Allow CORS for frontend (localhost:3000, 5173, etc.)
app.use(
  cors({
    origin: "*", // for dev; replace with your frontend URL in production
    methods: ["GET", "POST"],
  })
)

// ✅ Use Multer in memory for quick upload
const upload = multer({ storage: multer.memoryStorage() })

// ✅ Supabase client (use service role key for full access)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ✅ Upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("🟢 Incoming upload...")

    const file = req.file
    if (!file) {
      console.error("❌ No file received")
      return res.status(400).json({ error: "No file uploaded" })
    }

    const filePath = `products/${Date.now()}-${file.originalname}`

    console.log(`📂 Uploading to: ${filePath}`)

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath)
    const imageUrl = data.publicUrl

    console.log("✅ Uploaded successfully:", imageUrl)
    res.json({ url: imageUrl })
  } catch (err) {
    console.error("❌ Upload failed:", err.message)
    res.status(500).json({ error: err.message })
  }
})

// ✅ Start server
app.listen(3001, () => console.log("✅ Server running on http://localhost:3001"))
