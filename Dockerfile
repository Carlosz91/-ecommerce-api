FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY keystore.p12 .
COPY target/productos-api-1.0.0.jar app.jar
EXPOSE 8443
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=mysql"]
