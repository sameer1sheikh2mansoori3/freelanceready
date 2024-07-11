import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/sign-up/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.models';
import { User } from 'next-auth';

export async function POST(request: Request) {
    // Connect to the database
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        // * :Update the user's message acceptance status

        const updatedUser = await UserModel.findByIdAndUpdate(

            userId, {

            isAcceptingMessages: acceptMessages
        }, {
            new: true
        }
        )

        if (!updatedUser) {
            // User not found
            return Response.json(
                {
                    success: false,
                    message: 'Unable to find user to update message acceptance status',
                },
                { status: 404 }
            );
        }

        // Successfully updated message acceptance status
        return Response.json(
            {
                success: true,
                message: 'Message acceptance status updated successfully',
                updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating message acceptance status:', error);
        return Response.json(
            { success: false, message: 'Error updating message acceptance status' },
            { status: 500 }
        );
    }
}