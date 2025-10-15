import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTab from "../../components/TaskStatusTab";
import TaskCard from "../../components/Cards/TaskCard";
import toast from "react-hot-toast";

const ManagerTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const getAllTasks = async () => {
    // Prevent multiple simultaneous requests
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });
      
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // map status summary data
      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "pending", count: statusSummary?.pendingTasks || 0 },
        { label: "in-progress", count: statusSummary?.inProcessTasks || 0 },
        { label: "completed", count: statusSummary?.completeTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetch tasks: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  //download task report
  const handleDownloadReport = async () => {
   try{
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS,{
        responseType: "blob",
      });

      //create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }catch(error){
      console.error("Error downloading expense details: ", error)
      toast.error("Failed to download expense details . Please try again.")
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]); // Removed empty return

  return (
    <DashboardLayout activeMenu="Manager Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTab
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              <button
                className="hidden lg:flex download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : allTasks.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {allTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((user) => user.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedToDoCount={item.completedToDoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManagerTasks;