import { Schema, model, models } from "mongoose";

const ContactSchema = new Schema({
  contactName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    }
  },
  views: { type: Number, default: 0 },
  alertEmitted: { type: Boolean, default: false }
})

const Contact = models.Contact || model('Contact', ContactSchema);

export default Contact;