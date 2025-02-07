#include "i2c.hpp"
#include "PCA9685.hpp"
#include "DC_motor.hpp"
#include "Servo_motor.hpp"
#include <iostream>
#include <string>
#include <thread>
#include <chrono>
#include <limits>

int main() {
    try {
        std::cout << "Initializing I2C and PCA9685..." << std::endl;
        
        // Initialize I2C devices and controllers
        I2CDevice i2c_dc("/dev/i2c-7", 0x40);    // DC motor on 0x40
        I2CDevice i2c_servo("/dev/i2c-7", 0x60); // Servo on 0x60
        
        PCA9685 pca_dc(i2c_dc);
        PCA9685 pca_servo(i2c_servo);
        
        PWMThrottleHat motor(pca_dc, 0);
        Servo servo(pca_servo);

        std::string input;
        float value;

        // Print menu
        std::cout << "\nControl Commands:" << std::endl;
        std::cout << "m [throttle]: Control DC motor (-1.0 to 1.0)" << std::endl;
        std::cout << "s [angle]: Control servo (0 to 180 degrees)" << std::endl;
        std::cout << "q: Quit program" << std::endl;

        while (true) {
            std::cout << "\nEnter command: ";
            std::cin >> input;

            if (input == "q") {
                break;
            }
            
            if (std::cin >> value) {
                if (input == "m") {
                    if (value >= -1.0 && value <= 1.0) {
                        std::cout << "Setting motor throttle to: " << value << std::endl;
                        motor.setThrottle(value);
                    } else {
                        std::cout << "Invalid throttle value. Use -1.0 to 1.0" << std::endl;
                    }
                }
                else if (input == "s") {
                    if (value >= -90 && value <= 90) {
                        std::cout << "Setting servo angle to: " << value << std::endl;
                        servo.setAngle(0, value);
                    } else {
                        std::cout << "Invalid angle value. Use 0 to 180" << std::endl;
                    }
                }
                else {
                    std::cout << "Invalid command" << std::endl;
                }
            } else {
                std::cout << "Invalid input format" << std::endl;
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            }
        }

        // Cleanup
        std::cout << "\nStopping motors and centering servo..." << std::endl;
        motor.setThrottle(0);
        servo.setAngle(0, 0);
        std::cout << "Program stopped." << std::endl;

    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
