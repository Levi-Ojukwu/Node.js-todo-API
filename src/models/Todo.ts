import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITodo extends Document {
    title: string;
    description: string;
    deadline: Date;
    completedAt?: Date;
    tags: string[];
    user: string;
    createdAt: Date;
    updatedAt: Date;
}

const TodoSchema: Schema<ITodo> = new Schema<ITodo>({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    completedAt: { type: Date, default: null },
    tags: { type: [String], default: []},
    user: { type: String, required: true },
}, {
    timestamps: true
});

export const Todo: Model<ITodo> = mongoose.model<ITodo>("Todo", TodoSchema);
export default Todo; 


