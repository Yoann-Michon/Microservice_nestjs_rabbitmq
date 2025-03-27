import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Check the health status of all services',
    description: 'Perform a health check on all dependent services like auth-service, event-service, user-service, and notification-service.',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check of all services is successful',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Health check of all services' },
        services: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              service: { type: 'string', example: 'auth-service' },
              status: { type: 'string', example: 'healthy 🟢' },
              message: { type: 'string', example: 'Service is healthy' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error during health check',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Error during health check' },
        details: { type: 'string', example: 'Error message here' },
      },
    },
  })
  async checkHealth() {
    try {
      const healthResults = await Promise.all([
        this.checkServiceHealth('auth-service', 'http://auth-service:4001/health'),
        this.checkServiceHealth('event-service', 'http://event-service:4002/health'),
        this.checkServiceHealth('user-service', 'http://user-service:4004/health'),
        this.checkServiceHealth('notification-service', 'http://notification-service:4006/health'),
      ]);

      console.table(healthResults, ['service', 'status', 'message']);

      return {
        statusCode: HttpStatus.OK,
        message: 'Health check of all services',
        services: healthResults,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error during health check',
        details: error?.message || 'Unknown error',
      };
    }
  }

  private async checkServiceHealth(serviceName: string, serviceUrl: string) {
    try {
      const response = await fetch(serviceUrl);
      
      if (response.ok) {
        const data = await response.json();
        return {
          service: serviceName,
          status: 'healthy 🟢',
          message: 'Service is healthy',
          response: data,
        };
      } else {
        return {
          service: serviceName,
          status: 'unhealthy 🔴',
          message: `Service at ${serviceUrl} is not healthy`,
        };
      }
    } catch (error) {
      return {
        service: serviceName,
        status: 'unhealthy 🔴',
        message: error?.message || 'Unknown error',
      };
    }
  }
}
