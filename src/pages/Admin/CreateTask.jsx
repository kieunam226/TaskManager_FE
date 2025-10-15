import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import { PRIORITY_DATA } from "../../utils/data";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import DeleteAlert from "../../components/DeleteAlert";
import Modal from "../../components/Modal";

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Debug: Log để kiểm tra taskId
  console.log("Location state:", location.state);
  console.log("Task ID:", location.state?.taskId);

  const { taskId } = location.state || {};

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "", // 
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Prevent double fetch
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = ({ key, value }) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // reset form
    setTaskData({
      title: "",
      description: "",
      priority: "low",
      dueDate: "", // 
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // Create Task
  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      if (response.data) {
        toast.success("Task Created Successfully");
        clearData();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  // Update Task
  const updateTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find(
          (task) => task.text === item
        );
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoChecklist: todoList,
        }
      );

      if (response.data) {
        toast.success("Task Updated Successfully");
        // Refresh task data after update
        await getTaskDetailsByID();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    console.log("🚀 handleSubmit called");
    console.log("📋 Current taskData:", taskData);
    console.log("🆔 TaskId:", taskId);

    setError(null);

    // Input validation
    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due date is required.");
      return;
    }

    if (taskData.assignedTo?.length === 0) {
      setError("Task not assigned to any member");
      return;
    }

    if (taskData.todoChecklist?.length === 0) {
      setError("Add at least one todo task");
      return;
    }

    if (taskId) {
      console.log("✏️ Updating task...");
      updateTask();
      return;
    }

    console.log("➕ Creating task...");
    createTask();
  };

  // get Task info by Id
  const getTaskDetailsByID = async () => {
    console.log("🔍 Fetching task with ID:", taskId);

    // Prevent double fetch
    if (isFetching) {
      console.log("⏸️ Already fetching, skipping...");
      return;
    }

    setIsFetching(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      console.log("📦 Response data:", response.data);

      
      if (response.data) {
        const taskInfo = response.data;
        console.log("✅ Task info:", taskInfo);

        setCurrentTask(taskInfo);

        const newTaskData = {
          title: taskInfo.title || "",
          description: taskInfo.description || "",
          priority: taskInfo.priority || "low",
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : "",
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        };

        console.log("📝 Setting task data:", newTaskData);
        setTaskData(newTaskData);
      } else {
        console.error("❌ No task data in response");
        toast.error("Task not found");
      }
    } catch (error) {
      console.error("❌ Error fetching task details:", error);
      toast.error("Failed to load task details");
    } finally {
      setIsFetching(false);
    }
  };

  //delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Expense details deleted successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (taskId && isMounted) {
      getTaskDetailsByID();
    }

    return () => {
      isMounted = false;
    };
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer  "
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>

              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange({ key: "title", value: target.value })
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>

              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange({ key: "description", value: target.value })
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) =>
                    handleValueChange({ key: "priority", value })
                  }
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>

                <input
                  placeholder=" Create App UI"
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={({ target }) =>
                    handleValueChange({ key: "dueDate", value: target.value })
                  }
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className=" text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => {
                    handleValueChange({ key: "assignedTo", value });
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>

              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange({ key: "todoChecklist", value })
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>

              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange({ key: "attachments", value })
                }
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
