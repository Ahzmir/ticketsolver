import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
  studentId: string;
  password: string;
}

const UserSchema: Schema<IUser> = new Schema({
  studentId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.models.User as Model<IUser> || mongoose.model<IUser>('User', UserSchema);
