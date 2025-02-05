#ifndef BACKOFF_RECOVERY_H
#define BACKOFF_RECOVERY_H

#include <nav_core/recovery_behavior.h>
#include <costmap_2d/costmap_2d_ros.h>
#include <tf2_ros/buffer.h>
#include <base_local_planner/costmap_model.h>
#include <string>

namespace backoff_recovery
{
    class BackoffRecovery : public nav_core::RecoveryBehavior
    {
    public:
        BackoffRecovery();

        void initialize(std::string name, tf2_ros::Buffer *,
                        costmap_2d::Costmap2DROS *, costmap_2d::Costmap2DROS *local_costmap);

        void runBehavior();

        ~BackoffRecovery();

    private:
        bool initialized_;
        double backoff_distance_, frequency_, euclidean_distance_, vel_;

        // 골 콜백함수 호출 시 중지하기 위함
        bool should_stop_;
        geometry_msgs::PoseStamped previous_goal_;
        geometry_msgs::PoseStamped current_goal_;
        bool hasGoalChanged(const geometry_msgs::PoseStamped::ConstPtr &new_goal);

        ros::Subscriber goal_sub_;
        ros::NodeHandle *nh_;
        void goalCallback(const geometry_msgs::PoseStamped::ConstPtr &msg);
    };
};
#endif