# 모터 제어
```
#include "DC_motor.hpp"
#include "Servo_motor.hpp"

int main(){
	//초기화
	I2CDevice i2c_dc("/dev/i2c-7", 0x40);    // DC motor on 0x40
	I2CDevice i2c_servo("/dev/i2c-7", 0x60); // Servo on 0x60

	PCA9685 pca_dc(i2c_dc);
	PCA9685 pca_servo(i2c_servo);

	PWMThrottleHat motor(pca_dc, 0);
	Servo servo(pca_servo);



	//setAngle  (channel = 0, -45 <= angle <= 45)
	servo.setAngle(int channel, float angle);

	//setThrottle	(-1 <= throttle <= 1)
	motor.setThrottle(float throttle);
}
```

