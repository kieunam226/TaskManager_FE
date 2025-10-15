import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const getStatusTagColor = (status) => {
    switch (status) {
      case "in-progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  // FIX 1: Wrap với useCallback để tránh warning dependency
  const getTaskDetailsByID = useCallback(async () => {
    try {
      setLoading(true);
      // FIX 2: Sửa typo reponse → response
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task details: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // FIX 3: Cải thiện error handling
  const updateTodoChecklist = async (index) => {
    if (!task?.todoChecklist?.[index]) return;

    const todoChecklist = [...task.todoChecklist];
    const originalValue = todoChecklist[index].completed;
    
    // Optimistic update
    todoChecklist[index].completed = !originalValue;
    setTask({ ...task, todoChecklist });

    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { todoChecklist }
      );

      if (response.status === 200 && response.data?.task) {
        setTask(response.data.task);
      }
    } catch (error) {
      console.error("Error updating checklist:", error);
      // Revert về giá trị cũ nếu API fail
      todoChecklist[index].completed = originalValue;
      setTask({ ...task, todoChecklist });
    }
  };

  // FIX 4: Cải thiện xử lý link
  const handleLinkClick = (link) => {
    if (!link) return;
    
    let formattedLink = link.trim();
    if (!/^https?:\/\//i.test(formattedLink)) {
      formattedLink = "https://" + formattedLink;
    }
    window.open(formattedLink, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
  }, [id, getTaskDetailsByID]);

  if (loading) {
    return (
      <DashboardLayout activeMenu="My Tasks">
        <div className="mt-5 text-center">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout activeMenu="My Tasks">
        <div className="mt-5 text-center">Task not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm md:text-xl font-medium">
                {task.title}
              </h2>
              <div
                className={`text-[13px] font-medium ${getStatusTagColor(
                  task.status
                )} px-4 py-0.5 rounded`}
              >
                {task.status}
              </div>
            </div>
            
            <div className="mt-4">
              <InfoBox label="Description" value={task.description} />
            </div>
            
            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-6 md:col-span-4">
                <InfoBox label="Priority" value={task.priority} />
              </div>

              <div className="col-span-6 md:col-span-4">
                <InfoBox
                  label="Due Date"
                  value={
                    task.dueDate
                      ? moment(task.dueDate).format("DD MMM YYYY")
                      : "N/A"
                  }
                />
              </div>
              
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-500">
                  Assigned To
                </label>
                <AvatarGroup
                  avatars={
                    task.assignedTo?.map((item) => item.profileImageUrl) || []
                  }
                  maxVisible={5}
                />
              </div>
            </div>

            {task.todoChecklist && task.todoChecklist.length > 0 && (
              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>
                {task.todoChecklist.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>
            )}

            {task.attachments && task.attachments.length > 0 && (
              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">
                  Attachments
                </label>
                {task.attachments.map((link, index) => (
                  <Attachment
                    key={`link_${index}`}
                    link={link}
                    index={index}
                    onClick={() => handleLinkClick(link)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">
        {value || "N/A"}
      </p>
    </>
  );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
      />
      <p className="text-[13px] text-gray-800">{text}</p>
    </div>
  );
};

const Attachment = ({ link, index, onClick }) => {
  return (
    <div
      className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={onClick}
    >
      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs text-gray-400 font-semibold mr-2">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className="text-xs text-black truncate">{link}</p>
      </div>
      <LuSquareArrowOutUpRight className="text-gray-400 flex-shrink-0" />
    </div>
  );
};