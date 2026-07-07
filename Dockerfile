FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src src/
RUN javac -version && \
    apk add --no-cache maven && \
    mvn package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/productos-api-1.0.0.jar app.jar
COPY keystore.p12 .
EXPOSE 8443
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=mysql"]
