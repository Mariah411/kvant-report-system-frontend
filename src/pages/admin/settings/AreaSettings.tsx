import { Button, Card, Form, Layout, message, PageHeader, Table } from "antd";
import { Content } from "antd/lib/layout/layout";
import { FC, useEffect, useState } from "react";
import PlacesService from "../../../api/PlacesService";
import PlaceDirectionForm from "../../../components/forms/createForms/PlaceDirectionForm";
import ModalWithForm from "../../../components/ModalWithForm";
import { colsArea } from "../../../data/placesTableData";
import { PlaceAdmin } from "../../../models/IPlace";

const AreaSettings: FC = () => {
  const [areasData, setAreasData] = useState<PlaceAdmin[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const getAreaData = async () => {
    const response = await PlacesService.getAreas();
    setAreasData(response);
    setIsLoadingTable(false);
  };

  const LoadingData = () => {
    setIsLoadingTable(true);
    getAreaData();
  };

  useEffect(() => LoadingData(), []);

  //модальное окно
  const [AreaModVisible, setAreaModVisible] = useState(false);

  const showModalArea = () => {
    setAreaModVisible(true);
  };

  // добавление района
  const onCreateArea = async (values: { name: string }) => {
    const { name } = values;

    const response = await PlacesService.addArea(name)
      .then(() => {
        message.success("Успешно добавлено");
        setAreaModVisible(false);
        LoadingData();
      })
      .catch((err) => {
        message.error("Произошла ошибка при добавлении района");
        setAreaModVisible(false);
      });
  };

  const [formArea] = Form.useForm();

  return (
    <Layout className="site-layout">
      <Content className="content content_m-20">
        <PageHeader
          ghost={false}
          title="Список районов"
          subTitle="Районы Белгородской области, в которых проводится мониториг"
          extra={[
            <Button key="1" type="primary" onClick={showModalArea}>
              Добавить район
            </Button>,
          ]}
        />

        <Card>
          <Table
            loading={isLoadingTable}
            className="table-striped-rows"
            columns={colsArea}
            size="middle"
            dataSource={areasData}
            rowKey={(record) => record.id}
          />
        </Card>

        <ModalWithForm
          title="Новый район"
          isVisible={AreaModVisible}
          form={formArea}
          setVisible={setAreaModVisible}
          onCreate={onCreateArea}
        >
          <PlaceDirectionForm form={formArea} label="Название района" />
        </ModalWithForm>
      </Content>
    </Layout>
  );
};

export default AreaSettings;
