import pyhdb



with open("password.txt") as f:
    password = f.read().strip()


class Hana:

    def __init__ (self, password):
        self.connection = pyhdb.connect(
            host = "52.87.77.114",
            port = 30015,
            user = 'TEAM03_USER01',
            password = password)
        self.cursor = self.connection.cursor()

        self.lastStatement = ""

    def execute(self, statement, commit=False):
        self.lastStatement = statement
        self.cursor.execute(statement)
        if commit:
            self.connection.commit()
        return self.cursor.fetchall()

    def close(self):
        self.connection.close()

    #############################

    def insertRain(self, data):
        '''data is a dict with column names as keys'''
        statement = "insert into TEAM03.CHIRPS_RAINFALL VALUES ('{date}', ST_GEOMfromText('Point({x} {y})'), {value});".format(value=data["value"], x=data["x"], y=data["y"], date=data["date"])
        self.execute(statement, True)

    
    def getRain(self, date):
        statement = "select *, POINT.ST_ASgeoJSON() from CHIRPS_RAINFALL"

if __name__ == "__main__":

    "HOW TO USE"
    ###########
    hana = Hana()


    hana.close()
