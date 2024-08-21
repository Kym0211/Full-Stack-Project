import React from "react";

export default function Comments({ comments }) {

    return (
        <div className="lg:col-span-2 mt-8 lg:mt-0">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex items-start"
            >
              <img
                src={comment.owner.avatar}
                alt={comment.owner.username}
                className="w-10 mt-2 h-10 rounded-full mr-4"
              />
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-400">
                  {comment.owner.username}
                </p>
                <p className="mt-2">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}